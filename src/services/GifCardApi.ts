
import api from "../lib/axios";
import type { GifcardFormData } from "../types";

export async function createGifcard(formData: GifcardFormData){
  try{
    const { data } = await api.post('/gifcards', formData); 

  } catch (error) {
    console.log(error);
  }
    

}