import Image from "next/image";
import { InfoProfile } from "./info-Profile";
import { DescriptionProfile } from "./description-profile"
interface CardProfileProps{
    user:{
        id: string;
        name: string | null;
        username: string | null;
        bio: string | null;
        image: string | null;
    }
}

export function CardProfile({ user }: CardProfileProps){
    return(
        <section className="w-full flex flex-col items-center mx-auto px-4">
            <div>
                <Image
                    className="rounded-xl bg-gray-50 object-cover border-4 border-white"
                    alt="User Profile Photo"
                    src={user.image ?? "./public/userProfileDefault.jpg"}
                    width={100}
                    height={100}
                    priority
                    quality={100}></Image>
            </div>
            <div>
                <InfoProfile initialName={user.name ?? "Digite seu nome"} />
                <DescriptionProfile initialDescription={user.bio ?? "Digite aqui sua descrição"} />
            </div>
            
        </section>
    )
}