import axios from 'axios';
interface FormData {
  email: string;
  password: string;
}

const postForm = async (urlPath: string, form: FormData) => {
  try {
    return await axios.post(`http://localhost:8000${urlPath}`, form);
  } catch (error) {
    return error;
  }
};

export default postForm;
