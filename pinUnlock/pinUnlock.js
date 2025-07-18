import { LightningElement, api, track } from 'lwc';
import checkPinAndUnlock from '@salesforce/apex/PinUnlockController.checkPinAndUnlock';
import updateUserPin from '@salesforce/apex/PinUnlockController.updateUserPin';
import getIsPasswordCorrect from '@salesforce/apex/PinUnlockController.getIsPasswordCorrect';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import padlock from '@salesforce/resourceUrl/padlock';
import padlockOpen from '@salesforce/resourceUrl/padlockOpen';

export default class PinUnlock extends LightningElement {
    @api recordId;

    @track pin = '';
    @track isPasswordCorrect = false;
    @track showAdminModal = false;
    @track newUserPin = '';

    get lockImageUrl() {
        return this.isPasswordCorrect ? padlockOpen : padlock;
    }

    connectedCallback() {
        getIsPasswordCorrect({ recordId: this.recordId })
            .then(result => {
                this.isPasswordCorrect = result;
            })
            .catch(error => {
                console.error('Error loading IsPasswordCorrect:', error);
            });
    }

    handleInput(event) {
        this.pin = event.target.value;
    }

    reloadPageWithDelay(delay = 500) {
        setTimeout(() => window.location.reload(), delay);
    }

    handleSubmit() {
        if (this.pin.length !== 4) {
            this.showToast('Invalid input', 'PIN must be 4 digits.', 'error');
            return;
        }

        checkPinAndUnlock({ recordId: this.recordId, inputPin: this.pin })
            .then((result) => {
                const responses = {
                    'user_success': () => {
                        this.isPasswordCorrect = true;
                        this.showToast('Access Granted', 'User PIN accepted.', 'success');
                        this.reloadPageWithDelay();
                    },
                    'admin_success': () => {
                        this.showAdminModal = true;
                    },
                    'invalid': () => {
                        this.isPasswordCorrect = false;
                        this.showToast('Incorrect Password', 'PIN is invalid.', 'error');
                        this.reloadPageWithDelay();
                    }
                };

                if (responses[result]) {
                    responses[result]();
                } else {
                    this.showToast('Unknown response', 'Unexpected result: ' + result, 'warning');
                }
            })
            .catch(error => {
                console.error(error);
                this.showToast('Error', error.body?.message || 'Unknown error', 'error');
            });
    }

    handleHide() {
        checkPinAndUnlock({ recordId: this.recordId, inputPin: '----' })
            .then(() => {
                this.isPasswordCorrect = false;
                this.showToast('Field Hidden', 'Password flag reset.', 'info');
                this.reloadPageWithDelay();
            })
            .catch(error => {
                this.showToast('Error', error.body?.message || 'Unknown error', 'error');
            });
    }

    handleNewPinChange(event) {
        this.newUserPin = event.target.value;
    }

    async saveNewPin() {
        if (this.newUserPin.length !== 4) {
            this.showToast('Invalid input', 'PIN must be 4 digits.', 'error');
            return;
        }

        try {
            await updateUserPin({ newPin: this.newUserPin });
            this.showToast('Success', 'User PIN updated.', 'success');
            this.showAdminModal = false;
            const result = await getIsPasswordCorrect({ recordId: this.recordId });
            this.isPasswordCorrect = result;
        } catch (error) {
            this.showToast('Error', error.body?.message || 'Failed to update PIN.', 'error');
        }
    }

    closeAdminModal() {
        this.showAdminModal = false;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant,
                mode: 'dismissable'
            })
        );
    }
}
