import axios from 'axios';

const postForm = async (form: never) => {
  try {
    const response = await axios.post('http://localhost:8000/account/signup', form);
    return response;
  } catch (error) {
    return error;
  }
};

export default postForm;
