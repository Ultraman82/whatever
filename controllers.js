const client = require("../whatever/db.js");

exports.list = async (req, res) => {
    try {
    let wordlist = await client.query(
        "SELECT * FROM vocabulary"
        );
        wordlist = wordlist.rows;
        if (wordlist.length == 0) {
            res.status(400).send({
                message: "Database appears to be empty"
            });
            return;
        }
    } catch (err) {
        console.log(err);
    }
};


