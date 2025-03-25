// js/components/editBanner.js
export const initEditMode = () => {
    addEditBanner();
    addEditButton();
};

const addEditBanner = () => {
    const banner = document.createElement("div");
    banner.id = "edit-banner";
    
    // Styles d'origine
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.width = "100%";
    banner.style.backgroundColor = "black";
    banner.style.color = "white";
    banner.style.textAlign = "center";
    banner.style.padding = "10px";
    banner.style.fontSize = "16px";
    banner.style.zIndex = "1000";

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

    // Styles d'origine
    editButton.style.marginLeft = "30px";
    editButton.style.cursor = "pointer";
    editButton.style.color = "black";
    editButton.style.fontSize = "14px";
    editButton.style.fontWeight = "bold";
    editButton.style.fontFamily = "Work Sans";

    h2.appendChild(editButton);
};