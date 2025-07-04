/* IMPORT REQUIRED MODULES START */
import { BlockStack, Button, InlineStack, Modal, Text } from '@shopify/polaris'
import React from 'react'
/* IMPORT REQUIRED MODULES END */

/* CONFIRMATION MODAL FUNCTIONAL COMPONENT START */
function ConfirmationModal({ isOpen, setIsOpen, text, title, buttonText, buttonAction, destructive,loading }) {
    return (
        <Modal open={isOpen} id="ConfirmationModal"
        size='small'
            onClose={() => setIsOpen(false)}
            title={title}
            primaryAction={{ content: buttonText, onAction: () => buttonAction(), destructive: destructive ,loading:loading}}
            secondaryActions={[
                {
                    content: 'Cancel',
                    onAction: ()=>setIsOpen(false),
                },
            ]}
        >
            <Modal.Section >
                <BlockStack gap={200}>
                    <Text breakWord={true}>{text}</Text>
                </BlockStack>
            </Modal.Section>
        </Modal>
    )
}

export default ConfirmationModal
/* CONFIRMATION MODAL FUNCTIONAL COMPONENT END */