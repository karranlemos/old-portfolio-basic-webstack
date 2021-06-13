class MainMenu {

    constructor() {
        this.navbar = document.getElementById('main-menu')
        if (!this.navbar)
            throw 'Main menu not found'
        this.mobileButton = this.navbar.querySelector('.mobile-button')
        if (!this.mobileButton)
            throw 'Mobile button not found'
        this.menuOptions = this.navbar.querySelector('.menu-options')
        if (!this.menuOptions)
            throw 'Menu options not found'

        this.homeButtons = this.navbar.querySelectorAll('.home-button')
        // Uses JS to send to the top of the page so it doesn't display
        // domain.com/#top
        for (let homeButton of this.homeButtons) {
            homeButton.addEventListener('click', function() {
                this.closeMobileMenu()
                this.goToTopOfPage()
            }.bind(this))
            var anchor = homeButton.querySelector('a')
            if (anchor) {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault()
                })
            }
        }

        this.subpagesButtons = this.menuOptions.getElementsByClassName('menu-button')
        for (let subpagesButton of this.subpagesButtons) {
            subpagesButton.addEventListener('click', function() {
                this.closeMobileMenu()
            }.bind(this))
        }
        
        this.mobileButton.addEventListener('click', this.toggleMobileMenu.bind(this))
        window.addEventListener('scroll', this.checkNavbarFixed.bind(this))
        
        this.forceHashJump()

        this.checkNavbarFixed()
    }

    toggleMobileMenu() {
        this.navbar.classList.toggle('mobile-open')
    }

    closeMobileMenu() {
        this.navbar.classList.remove('mobile-open')
    }

    checkNavbarFixed() {
        const MIN_PINNED_NAVBAR = 50
        if (window.pageYOffset > MIN_PINNED_NAVBAR)
            this.navbar.classList.add('pinned')
        else
            this.navbar.classList.remove('pinned')
    }

    goToTopOfPage() {
        window.scrollTo(0, 0)
        history.pushState(null, null, '/')
    }



    forceHashJump() {
        if (window.location.hash !== '')
            window.location.hash = window.location.hash
    }
}



// Due to lack of support to static fields
const _STATIC_MODAL_FIELDS = {
    _modals: {},
}

class Modal {

    constructor(modal) {
        this.modal = modal
        if (!this.modal.classList.contains('js-modal'))
            throw 'Not JS modal'
        
        this.modalName = this.modal.getAttribute('data-modal-name')
        if (!this.modalName)
            throw 'No modal name found'
        if (_STATIC_MODAL_FIELDS._modals.hasOwnProperty(this.modalName))
            throw 'Duplicated modal name'
            
        this.buttonClose = this.modal.querySelector('.close')
        if (!this.buttonClose)
            throw 'Close button not found'

        this.buttonClose.addEventListener('click', this.closeModal.bind(this))
        this.modal.addEventListener('click', function(e) {
            if (e.target === this.modal)
                this.closeModal()
        }.bind(this))

        this.modal.tabIndex = 0
        this.modal.addEventListener('keyup', function(e) {
            if (e.key === 'Escape')
                this.closeModal()
        }.bind(this))

        _STATIC_MODAL_FIELDS._modals[this.modalName] = this
    }

    closeModal() {
        this.modal.classList.remove('show')
    }

    openModal() {
        this.modal.classList.add('show')
        this.modal.focus()
    }


    
    static closeAllModals() {
        for (let modal of Object.values(_STATIC_MODAL_FIELDS._modals)) {
            modal.closeModal()
        }
    }
    
    static addModalOpener(modalOpener) {
        var modalName = modalOpener.getAttribute('data-modal-name')
        if (!modalName)
            return

        var modal = _STATIC_MODAL_FIELDS._modals[modalName]
        if (!modal)
            return

        modalOpener.addEventListener('click', function() {
            modal.openModal()
        })
    }

    static getAllModals() {
        var modalDivs = document.querySelectorAll('div.js-modal')
        var modals = []
        for (let modalDiv of modalDivs) {
            try {
                modals.push(new Modal(modalDiv))
            }
            catch {
                continue
            }
        }

        Modal._setModalOpeners()

        return modals
    }

    static _setModalOpeners() {
        var modalOpeners = document.getElementsByClassName('js-modal-opener')
        for (let modalOpener of modalOpeners) {
            Modal.addModalOpener(modalOpener)
        }
    }


}



class Helpers {
    constructor() {
        throw 'Static class'
    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}



var scriptObjects = {}
document.addEventListener('DOMContentLoaded', () => {
    scriptObjects.mainMenu = new MainMenu()
    scriptObjects.modals = Modal.getAllModals()
})