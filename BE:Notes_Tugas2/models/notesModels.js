const Notes = require("../schema/Notes");

// ambil semua notes
const findAll = async () => {
  return await Notes.findAll();
};

// tambah note
const create = async (data) => {
  return await Notes.create(data);
};

// cari berdasarkan id
const findById = async (id) => {
  return await Notes.findByPk(id);
};

// update note
const updateById = async (id, data) => {
  return await Notes.update(data, {
    where: { id: id },
  });
};

// hapus note
const deleteById = async (id) => {
  return await Notes.destroy({
    where: { id: id },
  });
};

module.exports = {
  findAll,
  create,
  findById,
  updateById,
  deleteById,
};