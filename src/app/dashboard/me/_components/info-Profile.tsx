'use client'
import { useState, useRef } from "react"
import { debounce} from 'lodash';
import { changeName } from '../_actions/change-name';
import { toast } from "sonner";

export function InfoProfile({initialName}: {initialName: string}){
    const [name, setName] = useState(initialName);
    const [originalName] = useState(initialName);

     const debouncedSaveName = useRef(
        debounce(async ( currentName: string ) => {
            if( currentName.trim() === ""){
                setName(originalName);
                return;
            }
            if( currentName !== name){
                try {
                    const response = await changeName({name: currentName});
                    if(response.error){
                        console.log(response.error);
                        toast.error(response.error);
                        setName(originalName);
                        return;
                    }
                    toast.success("Nome alterado com sucesso");

                } catch (error) {
                    console.log(error);
                    setName(originalName);
                }
            }
        },500)
     ).current

    function handleChangeName(event: React.ChangeEvent<HTMLInputElement>): void {
        setName(event.target.value);
        debouncedSaveName(event.target.value);
    }

    return(
        <input 
            className="text-xl md:text-2xl font-bold bg-gray-100 border border-gray-200 rounded-md outline-none p-2 w-full max-w-2xl text-center my-3" 
            type="text"
            value={name}
            onChange={handleChangeName} />
    )
}