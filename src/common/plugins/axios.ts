import axios from 'axios'
// import { loadingUtil } from '../../components/Loadingbar/index'
/*

*/


axios.interceptors.request.use((config) => config)
axios.interceptors.response.use((response) => response)


export default axios
