export const checkAuth = () => {
    return window.sessionStorage.getItem('token') !== null;
};

export const updateAuthButton = (isConnected) => {
    const authLink = document.querySelector('#auth-link');
    if (authLink) {
        if (isConnected) {
            authLink.textContent = 'logout';
            authLink.addEventListener('click', handleLogout);
        } else {
            authLink.textContent = 'login';
            authLink.href = 'login.html';
        }
    }
};

const handleLogout = (e) => {
    e.preventDefault();
    window.sessionStorage.removeItem('token');
    window.location.reload();
};

export const setupEditMode = (isConnected) => {
    if (isConnected) {
        const editBanner = document.querySelector('.edit-banner');
        const editButton = document.querySelector('.edit-button');
        if (editBanner) editBanner.style.display = 'flex';
        if (editButton) editButton.style.display = 'flex';
    }
}; 