class ClientError {
    constructor(message, code, type) {
        this.message = message;
        this.code = code;
        this.type = type;
    }
}

export default ClientError;