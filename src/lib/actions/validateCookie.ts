import { ApiJsonResponce, UserData } from "../definitions";


export default async function validateCoookie() {
    try {
        const res = await fetch('/api/validate-cookie', {
            credentials: "include"
        });
        if (res.status === 200) {
            const data = await res.json() as ApiJsonResponce;
            return data.payload as UserData || {
                userID: 0,
                is_employee: false,
                username: ''
            };
        }
        return null;
    } catch (e) {
        return null;
    }
}