import { useRuntimeConfig } from "#imports";
import axios from "axios";

export default () => {
	const config = useRuntimeConfig();

	return axios.create({
		baseURL: config.public.baseURL,
		withCredentials: true,
		headers: {
			"Content-Type": "application/json",
		},
	});
};
