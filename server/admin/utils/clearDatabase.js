export default function clearDatabase(database) {
    if (database.length) {
        return database.map((el) => clearDatabase(el));
    }
    return {
        username: database.username,
        email: database.email,
        isAdmin: database.isAdmin,
        isBlock: database.isBlock
    }
}
