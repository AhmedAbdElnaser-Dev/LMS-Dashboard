import { useRuntimeConfig } from "#imports"
import axios from "axios"

export default () => {
  const config = useRuntimeConfig()

  return axios.create({
    baseURL: "https://localhost:44332/api",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
