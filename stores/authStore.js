import { navigateTo } from "#app";
import { api } from "#imports";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
	state: () => ({
		user: null,
		loading: false,
		error: null,
	}),

	actions: {
		async login(credentials) {
			this.loading = true;
			this.error = null;

			console.log("test")
			try {
				const res = await api().post("/users/login", credentials);

				if (res.status === 200) {
					await this.verifyUser();
					navigateTo("/");
				}

				return res;
			} catch (error) {
				console.error("API Error:", error);
				this.error = error.response?.data?.message || "Login failed";
			} finally {
				this.loading = false;
			}
		},

		async verifyUser() {
			this.loading = true;
			try {
				const res = await api().get("/users/verify");

				if (res.status === 200) {
					this.user = res.data;
				} else {
					this.user = null;
				}
			} catch (error) {
				console.error("User verification failed:", error);
				this.user = null;
			} finally {
				this.loading = false;
			}
		},
	},

	getters: {
    isAuthenticated: (state) => !!state.user,
  },
});
