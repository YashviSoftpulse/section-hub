<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AI extends MY_Controller {
    
    public function __construct() {
        parent::__construct();
        
        $this->load->model(['My_library', 'Plan_model', 'App_model', 'Ai_sections']);
        $this->load->library(['shopify', 'myencryption']);
        $this->load->helper('file');

        $this->plan_features = APP_PLAN_LIST['basic']['features'];

        $this->daily_credit = 10;
        $this->cleaned_shop = str_replace('.myshopify.com', '', $this->shop);
        return $this;
    }

    public function ai_inject_section(){
        $theme_id = $this->input->post('theme', true);
        $theme_id = $this->myencryption->decode($theme_id, 42);
        $file_name = $this->input->post('fileName', true);

        try{
            if(!isset($theme_id) || empty($theme_id))
                throw new Exception("Please provide the theme.");

            $this->section_injector($theme_id, $file_name);
        } catch (Exception $ex) {
            $this->send_response(false, $ex->getMessage(), [
                'code' => $ex->getCode()
            ]);
        }
    }

    public function ai_section_save() {
        $name = $this->input->post('name', true);
        $prompt = $this->input->post('prompt', true);

        try{

            if(!isset($name) || empty($name))
                throw new Exception("PLease provide a chat name.", 422);
            if(!isset($prompt) || empty($prompt))
                throw new Exception("PLease provide prompt.", 422);

            $today = date('Y-m-d');
            $this->db->where(['shop' => $this->shop, 'date' => $today]);
            $count_today = $this->db->count_all_results('ai_sections');

            if ($count_today >= $this->daily_credit)
                throw new Exception("Daily limit of 10 section creation reached.", 422);
        
            // Handle uploaded file from form-data
            if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK)
                throw new Exception("No valid file uploaded", 401);

            $original_filename = $_FILES['file']['name'];
            $file_extension = strtolower(pathinfo($original_filename, PATHINFO_EXTENSION));
            if ($file_extension !== 'liquid')
                throw new Exception("Only .liquid files are allowed", 422);

            $file_tmp_path = $_FILES['file']['tmp_name'];
            $file_content = file_get_contents($file_tmp_path);
            
            // Generate clean filename
            $file_name = $this->generate_clean_filename($name, $this->cleaned_shop);
        
            // Set save path
            $base_path = AI_SECTIONS_PATH . $this->cleaned_shop . '/';
            if (!is_dir($base_path))
                mkdir($base_path, 0777, true);
        
            $full_path = $base_path . $file_name;
        
            // Write the file
            if (!write_file($full_path, $file_content))
                throw new Exception("Failed to save .liquid file", 500);
            // Handle uploaded file from form-data
        
            // Log to DB
            $result = $this->Ai_sections->insert([
                'shop' => $this->shop,
                'date' => $today,
                'file_name' => $file_name,
                'prompt' => $prompt,
                'chat_name' => $name
            ]);
        
            // Log to JSON
            $json_file = $base_path . 'upload_log.json';
            $existing_log = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : [];
            if (!isset($existing_log[$today])) {
                $existing_log[$today] = [];
            }
            $existing_log[$today][] = [
                'file_name' => $file_name,
                'chat_name' => $name,
                'prompt' => $prompt
            ];
            write_file($json_file, json_encode($existing_log, JSON_PRETTY_PRINT));
        
            $this->send_response(true, 'Section saved successfully');
            // echo json_encode(['status' => true, 'message' => '', 'file' => $file_name]);

        } catch(Exception $ex){
            $this->send_response(false, $ex->getMessage(), [
                'code' => $ex->getCode()
            ]);
        }
    }

    public function credit_used() {
        $limit = (int) $this->input->get('limit') ?: 10;
        $page = (int) $this->input->get('page') ?: 1;
        $sort = strtolower($this->input->get('sort')) === 'asc' ? 'ASC' : 'DESC';
        $offset = ($page - 1) * $limit;
    
        // Get paginated result from model
        $datas = $this->Ai_sections->get_credits_used_by_date($this->shop, $limit, $offset, $sort);
        $total_rows = $this->Ai_sections->count_unique_dates($this->shop);        
        foreach($datas as &$data){
            $data['file_name'] = str_replace('.liquid', '', $data['sections']);
            unset($data['sections']);
        }

        $this->send_response(true, 'Credits used fetched successfully', [
            'data' => $datas,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total_rows' => $total_rows,
                'total_pages' => ceil($total_rows / $limit)
            ]
        ]);
    }

    public function my_library($made_by = 'ai'){
        try{
            $get_list = $this->My_library->get_all(['theme_id', 'theme_name', 'published_assets', 'created_at'], ['shop' => $this->shop, 'made_by' => $made_by]);
            $final_data_array = [];
            // $section_used = []; // TO GET COUNT OF WHICH SECTIONS HAVE BEEN USED THE THE SHOP.
            $admin_shop_slug = str_replace(".myshopify.com", "", $this->shop);
            if(!empty($get_list)) {

                foreach($get_list as $list){
                    $decoded_files = json_decode($list['published_assets'], true);
                    // dd($list);

                    foreach($decoded_files as $files){
                        if (!is_array($files) || !isset($files['file'], $files['created_at']))
                            continue;

                        $file_name = str_replace('.liquid', '', $files['file']);
                        $final_data_array[] = [
                            'theme_name' => $list['theme_name'],
                            'theme_id' => $list['theme_id'],
                            'created_at' => convertUTCToTimezone($files['created_at'], $this->shop_data['timezone']),
                            'file_name' => $file_name,
                            'edit' => "https://admin.shopify.com/store/{$admin_shop_slug}/themes/{$list['theme_id']}/editor",
                        ];
                    }
                }
            };

            // Sort the array by 'created_at' in descending order
            usort($final_data_array, function ($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });

            
            $this->send_response(true, 'Success', [
                'data' => $final_data_array,
            ]);


        } catch (Exception $ex) {
            $this->send_response(false, $ex->getMessage(), [
                'code' => $ex->getCode()
            ]);
        }
    }

    public function chat_details(){
        header("Content-Type: application/json");
        $limit = (int) $this->input->get('limit') ?: 10;
        $page = (int) $this->input->get('page') ?: 1;
        
        $data = $this->Ai_sections->get_all_paginated('*', ['shop' => $this->shop], $page, $limit, null, []);
        $grouped = [];

        foreach ($data as $row) {
            $date = $row['date'];
            $file_path = AI_SECTIONS_PATH . $this->cleaned_shop . '/' . $row['file_name']; 

            $grouped[$date][] = [
                'chat_name' => $row['chat_name'],
                'file_name' => $row['file_name'],
                'prompt' => $row['prompt'],
                'code' => file_exists($file_path) ? file_get_contents($file_path) : '',
            ];
        }
        $total_rows = $this->Ai_sections->count_unique_dates($this->shop);

        $this->send_response(true, 'Chats fetched successfully.', [
            'data' => $grouped,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total_rows' => $total_rows,
                'total_pages' => ceil($total_rows / $limit)
            ]
        ]);
    }

    public function call_ai(){
        header("Content-Type: application/json");
        $prompt = $this->input->post('prompt', true);

        if(!isset($prompt) || empty($prompt))
            $this->send_response('false', "Please provide a prompt.");


        $content =  $prompt . <<<EOT
 Generate a reusable Shopify 2.0 section in Liquid :

General Requirements for All Sections:
- Absolute Completeness : You MUST generate the entire, complete Shopify Liquid section code. This includes ensuring all JSON objects and arrays within the schema are properly opened and closed with their corresponding brackets ({} and []), and that all Liquid tags (e.g., {% endfor %}, {% endif %}) are correctly paired and closed. Do not stop early or truncate the output.
- Encapsulation: All CSS styles MUST be strictly scoped inside a <style> tag, using #sp-{{ section.id }} as the primary parent selector to ensure no style leakage. Design Requirements: - class name must be start sh-
- Use **standard CSS only** (do not use Tailwind or utility classes)
- Must include: font styles, padding, margin, spacing, borders, colors, backgrounds, etc.
- All styles must be scoped inside `#sp-{{ section.id }}`
- Ensure **full responsiveness**: works well on desktop, tablet, and mobile
- Include proper heading levels, button styles, inputs (if any), and image styling
- Liquid + HTML Structure: Generate clean Liquid and HTML content, incorporating dynamic values from the section's settings and blocks.
- Code Quality: The generated Liquid code must be clean, proper, and render without any errors.
- Output Format :
    - Output ONLY the full Shopify Liquid section code.
    - No introductory or concluding text, explanations, or extraneous commentary.
    - No wrapping code block (for example, do not use triple backticks or any code fencing).
    - No inline or block comments within the generated code (Liquid, HTML, CSS, JS).
    - No Markdown formatting (e.g., bold, italics, lists, etc.) outside of the code itself.
- Final Output Order :
    1. <style> block
    2. HTML content (with Liquid for dynamic values and block iteration)
    3. <script> block (optional, but include if interactivity is needed)
    4. {% schema %} ... {% end endschema %} block

Schema Requirements (Crucial for Reusability and Valid Structure): - “name": "SH: [Descriptive Title Based on instruction]",
- name: A clear, descriptive, max 25 latter and human-readable name for the section.
- tag & class: Always include "tag": "section" and "class": "section" for proper theme integration.
- settings Array:
    - Use settings for global section configurations (e.g., title, description, background image).
    - Use appropriate type values for settings (e.g., text, richtext, image_picker, range, select, url).
    - Each setting must have a valid id (snake_case), label (human-readable), and optionally default values.
    - Crucial Default Value Handling:
        - For type: 'richtext' settings, the default value MUST be valid HTML, starting with a block-level tag like <p>, <h1> through <h6>, <ul>, or <ol>. For example: "default": "<p>Your default description text here.</p>".
        - For type: 'image_picker' settings, DO NOT include a default attribute. This type does not support a default image.
    - Avoid other invalid setting attributes. Only use attributes valid for the specified type.
- blocks Array (for repeatable content/components within the section):
    - If the section requires repeatable elements (e.g., testimonials, slides, hotspots, features), define them as blocks.
    - Each block must have a type (snake_case, unique within the section), name (human-readable), and its own settings array.
    - block settings follow the same rules as section settings.
- presets Array:
    - Always include a presets array for the section to appear in the theme editor's "Add section" list.
    - Presets must start with "name": "SH : "(e.g., `"name": "SH : Contact Form 2"`)
    - If the section uses blocks, include an empty blocks array or an array of default block types within the preset to allow users to add blocks.

Interactivity Requirements:
- If the section requires JavaScript for interactivity (e.g., sliders, tabs, hotspots), embed it within a <script> tag.
- All JavaScript must be self-contained and scoped to #sp-{{ section.id }} to prevent global conflicts. Use document.getElementById('sp-{{ section.id }}') to select the section's root element.
EOT;

        $payload = [
            "model" => "google/gemma-3n-e4b-it:free",
            "messages" => [
                [
                    "role" => "user",
                    "content" => $content
                ]
            ]
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => "https://openrouter.ai/api/v1/chat/completions",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer " . OPENAI_KEY,
                "Content-Type: application/json"
            ]
        ]);

        $response = curl_exec($ch);

        if (curl_errno($ch))
            exit(curl_error($ch));
        else
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        curl_close($ch);
        exit($response);
    }


























    /* TO PARSSE THE DESCRIPTION AND GENERATE A FILENAME */
    private function generate_clean_filename($description, $shop) {
        $stop_words = [
            'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'by', 'from',
            'with', 'without', 'section', 'widget', 'component', 'block', 'this', 'that',
            'it', 'is', 'shows', 'displays', 'containing', 'includes', 'featuring'
        ];
    
        $description = strtolower($description);
        $words = preg_split('/[\s\-]+/', $description);
    
        $filtered = [];
        foreach ($words as $word) {
            $word = preg_replace('/[^a-z0-9]/', '', $word); // clean symbols
            if ($word && !in_array($word, $stop_words)) {
                $filtered[] = $word;
            }
        }
    
        // Keep 4-6 keywords max
        $filtered = array_slice($filtered, 0, 6);
        $base_name = implode('-', $filtered) ?: 'section';
    
        // Check for filename collision
        $base_path = AI_SECTIONS_PATH . $shop . '/';
        $final_name = $base_name . '.liquid';
        $counter = 1;
        while (file_exists($base_path . $final_name)) {
            $final_name = $base_name . '-' . $counter . '.liquid';
            $counter++;
        }
    
        return $final_name;
    }

    /* INSERTING THE SECTION INTO THE THEME */
    private function section_injector($theme_id, $file_name){
		try{
            $file_location = AI_SECTIONS_PATH . "{$this->cleaned_shop}/{$file_name}";

			/* PAYLOAD FOR ADDING SECTIONS INTO THE ASSETS START */
            $data = [
                'files' => [
                    'body' => [
                        'type' => 'BASE64',
                        'value' => base64_encode(file_get_contents($file_location))
                    ],
                    'filename' => "sections/sh-{$file_name}"
                ],
                'themeId' => "gid://shopify/OnlineStoreTheme/{$theme_id}"
            ];

			/* PAYLOAD FOR ADDING SECTIONS INTO THE ASSETS END */
			$result = $this->shopify->insert_assets($data);

			if(!empty($result['upsertedThemeFiles'])){

                /* INSERTING IN DB FOR RECORD PURPOSE START */    
                $theme_details = $this->shopify->theme_name(['id' => "gid://shopify/OnlineStoreTheme/{$theme_id}"]);       
                $duplicate_shop = $this->My_library->get(null, ['shop' => $this->shop, 'theme_id' => $theme_id, 'made_by' => 'ai']);

                if($duplicate_shop){
                    // Check if the file name is not already in published_assets
                    if (strpos(json_encode($duplicate_shop['published_assets']), $file_name) === false) {
                        // Decode the existing published_assets array from the database
                        $decoded_data = json_decode($duplicate_shop['published_assets'], true) ?? [];

                        // Check if the file already exists in the decoded data
                        if (!array_key_exists($file_name, $decoded_data)) {
                            // Add the new asset with the file name as the key
                            $decoded_data[$file_name] = [
                                'file' => $file_name,
                                'created_at' => date('Y-m-d H:i:s')
                            ];

                            // Prepare the update data
                            $update_data = [
                                'published_assets' => json_encode($decoded_data),
                                'updated_at' => date('Y-m-d H:i:s')
                            ];

                            // Update the record in the database
                            $this->My_library->update(['id' => $duplicate_shop['id']], $update_data);
                        }
                    }
                } else {
                    $data = [ 
                        'shop' => $this->shop, 
                        'theme_id' => $theme_id,
                        'theme_name' => $theme_details['name'],
                        'made_by' => 'ai',
                        'published_assets' => json_encode([
                            $file_name => [
                                'file' => $file_name,
                                'created_at' => date('Y-m-d H:i:s')
                            ]
                        ])
                    ];

                    $this->My_library->insert($data);
                }
                /* INSERTING IN DB FOR RECORD PURPOSE END */

                /* COUNTING FOR HOW MANY TIMES THE SECTION HAS BEEN INSTALLED START */
                $this->app_model->increment_count(['shop' => $this->shop, 'app_status' => 'installed'], ['section_counts']);
                /* COUNTING FOR HOW MANY TIMES THE SECTION HAS BEEN INSTALLED END */

                $this->send_response(true, 'Added successfully.');
            }
			throw new Exception("Error Processing Request");
		} catch (Exception $ex) {

			if(str_contains($ex->getMessage(), 'FILE_VALIDATION_ERROR')){
				log_message('error', 'From section_injector function. For Shop:- ' . $this->shop . 'Error:- ' . $ex->getMessage());
				$this->send_response(false, $ex->getMessage());
			}

			$this->send_response(false, $ex->getMessage(), [
				'code' => $ex->getCode()
			]);
		}	
	}
    
    
}
?>