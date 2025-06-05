'use server'

import { z } from 'zod';
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma';
import { createSlug } from '@/utils/create-slug';

const createUsernameSchema = z.object({
    username: z.string({ message: "O username é obrigatório" }).min(4, "O nome de usuário deve ter pelo menos 4 caracteres").max(15, "O nome de usuário deve ter no máximo 15 caracteres"),
});

type CreateUsernameFormData = z.infer<typeof createUsernameSchema>;

export async function createUsername(data: CreateUsernameFormData) {

    const session = await auth();

    if (!session?.user) {
        return {
            data: null,
            error: "Usuário não autenticado",
        };
    }

    const schema = createUsernameSchema.safeParse(data);
    if (!schema.success) {
        return {
            data: null,
            error: schema.error.issues[0].message,
        };
    }
    
    try {
        const userId = session.user.id;
        const slug = createSlug(schema.data.username);
        const findUsername = await prisma.user.findFirst({
            where:{
                username: slug,
            },
        })

        if (findUsername) {
            return {
                data: null,
                error: "Esse username de usuário já está em uso",
            };
        }

        await prisma.user.update({
            where:{
                id: userId,
            },
            data:{
                username:slug,
            }
        })

        return{
            data: {
                message: "Username atualizado com sucesso",
                slug: slug,
            },
            error: null,
        }

    } catch (error) {
        return {
            data: null,
            error: "Falha ao atualizar o username do usuário",
        };
    }
}