"use strict";

const FILE_TABLE = "files";

async function up(trx) {
  // Updates file folder paths from NULL to "/"
  await trx
    .from(FILE_TABLE)
    .whereNull("folder_path")
    .update({ folder_path: "/" });
}

async function down() {}

module.exports = { up, down };
