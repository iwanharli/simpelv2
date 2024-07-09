/* eslint-disable */

import axios from "axios";
import Swal from "sweetalert2"
import router from './router'

// CEKLAUT  103.139.192.254:3003 
// DEV BE   http://103.139.192.254:9016
// PROD BE  http://103.179.86.243:9016

axios.defaults.baseURL = 'http://103.179.86.243:9016';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const publicPath = process.env.BASE_URL

axios.interceptors.response.use(
    response => response,
    error => {

        if (error.response && error.response.status === 401) {
            Swal.fire({
                title: "Orang lain sedang login menggunakan akun ini",
                width: 600,
                padding: "3em",
                color: "#716add",
                background: "#fff url(/images/trees.png)", imageUrl: "https://cdn-icons-png.flaticon.com/512/4413/4413923.png",
                backdrop: `
                    rgba(0, 0, 0, 0.8)
                    bottom right
                    repeat
                `,
                showCancelButton: false,
                confirmButtonText: 'Silahkan login kembali',
                preConfirm: () => {
                    localStorage.clear();
                    router.push({ name: "auth.login" });
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
            })
        } else {
            Swal.fire({
                icon: "error",
                title: "429",
                text: "Too Many Request, Reload in 1 Minute",
                showConfirmButton: false,
                timer: 30000
            })

            setTimeout(() => {
                location.reload()

            }, 60000)
        }

        return Promise.reject(error);
    });
