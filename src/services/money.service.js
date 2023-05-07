import http from "../http-common";
import authHeader from "./auth-header";

class MoneyDataService {
  getAll() {
    return http.get("/money", {headers: authHeader()});
  }

  get(id) {
    return http.get(`/money/${id}`, {headers: authHeader()});
  }

  create(data) {
    return http.post("/money", data, {headers: authHeader()});
  }

  update(id, data) {
    return http.put(`/money/${id}`, data, {headers: authHeader()});
  }

  delete(id) {
    return http.delete(`/money/${id}`, {headers: authHeader()});
  }
}

export default new MoneyDataService();
