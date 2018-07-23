export function loadingDataStorage(posts) {
    return { type: 'LOAD_DATA_STORAGE', posts };
}

export function saveSettings(settings) {
    return { type: 'SAVE_SETTINGS',settings };
}

export function loadSettings() {
    return { type: 'LOAD_SETTINGS' };
}

export function loadingUserInformation() {
    return { type: 'LOAD_USER_INFORMATION' };
}

export function saveUserInformation(user) {
    return { type: 'SAVE_USER_INFORMATION', user };
}

export function viewNotification(numberOfNotification) {
    return { type: 'VIEW_NOTIFICATION', numberOfNotification };
}
