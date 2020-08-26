module.exports = {
    createTestAccount() {
        return { user: "abc", pass: "abc" };
    },
    createTransport() {
        return { sendMail: () => {} };
    }
};
