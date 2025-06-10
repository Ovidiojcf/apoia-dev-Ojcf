'use client'

import { useState, useRef } from "react"
import { debounce} from 'lodash';
import { changeDescription } from '../_actions/change-description';
import { toast } from "sonner";

export function DescriptionProfile({initialDescription}: {initialDescription: string}){
    const [description, setDescription] = useState(initialDescription);
    const [originalDescription] = useState(initialDescription);

     const debouncedSaveDescription = useRef(
        debounce(async ( currentDescription: string ) => {
            if( currentDescription.trim() === ""){
                setDescription(originalDescription);
                return;
            }
            if( currentDescription !== description){
                try {
                    const response = await changeDescription({description: currentDescription});
                    if(response.error){
                        console.log(response.error);
                        toast.error(response.error);
                        setDescription(originalDescription);
                        return;
                    }
                    toast.success("Descrição alterado com sucesso");

                } catch (error) {
                    console.log(error);
                    setDescription(originalDescription);
                }
            }
        },5000)
     ).current

    function handleChangeDescription(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setDescription(event.target.value);
        debouncedSaveDescription(event.target.value);
    }

    return(
        <textarea 
            className="text-base bg-gray-100 border border-gray-200 rounded-md outline-none p-2 w-full max-w-2xl my-3 h-40 resize-none text-center" 
            value={description}
            onChange={handleChangeDescription} />
    )
}