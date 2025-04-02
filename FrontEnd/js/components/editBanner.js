// js/components/editBanner.js
export const initEditMode = () => {
    addEditBanner();
    addEditButton();
};

const addEditBanner = () => {
    const banner = document.createElement("div");
    banner.id = "edit-banner";
    banner.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <span>Mode édition</span>
    `;
    document.body.prepend(banner);
};

const addEditButton = () => {
    const h2 = document.querySelector("#portfolio h2");
    if (!h2) return;

    const editButton = document.createElement("span");
    editButton.id = "edit-button";
    editButton.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <span>Modifier</span>
    `;

    h2.appendChild(editButton);
};