/**
 * Simplified CSInterface for After Effects extensions
 */
function CSInterface() {
    // Constructor
}

/**
 * Evaluates a script in the host application.
 * @param script The script to be evaluated in the host application.
 * @param callback The callback function that receives the result of evaluation.
 */
CSInterface.prototype.evalScript = function(script, callback) {
    if (typeof __adobe_cep__ !== 'undefined') {
        __adobe_cep__.evalScript(script, callback);
    } else {
        console.error('CSInterface is not available');
        callback('CSInterface is not available');
    }
};

/**
 * Retrieves the path for a specific system folder.
 * @param pathType The type of system path.
 * @param callback The callback function that receives the path.
 */
CSInterface.prototype.getSystemPath = function(pathType, callback) {
    if (typeof __adobe_cep__ !== 'undefined') {
        var path = __adobe_cep__.getSystemPath(pathType);
        callback(path);
    } else {
        console.error('CSInterface is not available');
        callback(null);
    }
};

/**
 * The types of paths that can be requested.
 */
var SystemPath = {
    USER_DATA: 'userData',
    COMMON_FILES: 'commonFiles',
    MY_DOCUMENTS: 'myDocuments',
    APPLICATION: 'application',
    EXTENSION: 'extension',
    HOST_APPLICATION: 'hostApplication'
};

// Make SystemPath available globally
window.SystemPath = SystemPath;