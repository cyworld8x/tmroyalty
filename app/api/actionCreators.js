export function bookmarkPost(post) {
    return { type: 'BOOK_MARK_POST', post };
}

export function unbookmarkPost(post) {
    return { type: 'UNBOOK_MARK_POST', post };
}

export function loadingDataStorage(posts) {
    return { type: 'LOAD_DATA_STORAGE', posts };
}

export function saveSettings(settings) {
    return { type: 'SAVE_SETTINGS',settings };
}

export function loadSettings() {
    return { type: 'LOAD_SETTINGS' };
}

export function countViewedPosts() {
    return { type: 'VIEW_POST' };
}
