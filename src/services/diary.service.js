import http from "../http-common";
import authHeader from "./auth-header";

class DiaryDataService {
  getAll() {
    return http.get("/diaries", {headers: authHeader()});
  }

  get(id) {
    return http.get(`/diaries/${id}`, {headers: authHeader()});
  }

  create(data) {
    return http.post("/diaries", data, {headers: authHeader()});
  }

  update(id, data) {
    return http.put(`/diaries/${id}`, data, {headers: authHeader()});
  }

  delete(id) {
    return http.delete(`/diaries/${id}`, {headers: authHeader()});
  }

  deleteAll() {
    return http.delete(`/diaries`, {headers: authHeader()});
  }

  findByTitle(title) {
    return http.get(`/diaries?title=${title}`, {headers: authHeader()});
  }
}

export default new DiaryDataService();
