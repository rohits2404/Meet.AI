import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";

export const meetingsRouter = createTRPCRouter({

    remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const [removedMeetings] = await db.delete(meetings).where(
            and(eq(meetings.id,input.id),eq(meetings.userId,ctx.auth.user.id))
        ).returning()
        if(!removedMeetings){
            throw new TRPCError({ code: "NOT_FOUND", message: "Meetings Not Found"})
        }
        return removedMeetings;
    }),

    update: protectedProcedure.input(meetingsUpdateSchema).mutation(async ({ ctx, input }) => {
        const [updatedMeetings] = await db.update(meetings).set(input).where(
            and(eq(meetings.id,input.id),eq(meetings.userId,ctx.auth.user.id))
        ).returning()
        if(!updatedMeetings){
            throw new TRPCError({ code: "NOT_FOUND", message: "Meetings Not Found"})
        }
        return updatedMeetings;
    }),

    create: protectedProcedure.input(meetingsInsertSchema).mutation(async ({ input, ctx }) => {
        const [createdMeetings] = await db.insert(meetings).values({
            ...input,
            userId: ctx.auth.user.id
        }).returning()
        return createdMeetings;
    }),

    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingMeeting] = await db.select({
            ...getTableColumns(meetings),
            agent: agents,
            duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
        }).from(meetings).innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(and(eq(meetings.id,input.id),eq(meetings.userId,ctx.auth.user.id)))
        if(!existingMeeting){
            throw new TRPCError({ code: "NOT_FOUND", message: "Meetings Not Found" })
        }
        return existingMeeting;
    }),

    getMany: protectedProcedure.input(z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z.enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled
        ]).nullish()
    })).query(async ({ ctx, input }) => {
            const { search, page, pageSize, status, agentId } = input
            const data = await db.select({
                ...getTableColumns(meetings),
                agent: agents,
                duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
            }).from(meetings).innerJoin(agents, eq(meetings.agentId, agents.id)).where(and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentId ? eq(meetings.agentId, agentId) : undefined
            )).orderBy(desc(meetings.createdAt), desc(meetings.id)).limit(pageSize).offset((page-1)*pageSize)
            const [total] = await db.select({ count: count() }).from(meetings).innerJoin(agents, eq(meetings.agentId, agents.id))
            .where(and(
                eq(meetings.userId, ctx.auth.user.id),
                search ? ilike(meetings.name, `%${search}%`) : undefined,
                status ? eq(meetings.status, status) : undefined,
                agentId ? eq(meetings.agentId, agentId) : undefined
            ))
            const totalPages = Math.ceil(total.count / pageSize)
        return {
            items: data,
            total: total.count,
            totalPages
        }
    }),
})