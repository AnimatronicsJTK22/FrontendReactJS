import http from "../http-common";

const getAll = () => {
  return http.get("/diaries");
};

const get = id => {
  return http.get(`/diaries/${id}`);
};

const create = data => {
  return http.post("/diaries", data);
};

const update = (id, data) => {
  return http.put(`/diaries/${id}`, data);
};

const remove = id => {
  return http.delete(`/diaries/${id}`);
};

const removeAll = () => {
  return http.delete(`/diaries`);
};

const findByTitle = title => {
  return http.get(`/diaries?title=${title}`);
};

const TutorialService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByTitle
};

export default TutorialService;