"use server";

import prisma from "@/lib/db";
import { User } from "@prisma/client";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { revalidatePath } from "next/cache";
import { Pages, Routes } from "@/constants/enums";
import { auth } from "@clerk/nextjs/server";

export async function createUser(data: User) {
  try {
    const user = await prisma.user.create({ data });

    revalidatePath(Routes.OWNER);

    return { user };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 500, success: false, message: error.message };
    }
    return { status: 500, success: false, message: "Unknown error occurred" };
  }
}

export async function UpdateUser(clerkUserId: string, data: Partial<User>) {
  try {
    if (!clerkUserId) {
      return { error: "Missing user ID" };
    }

    if (!data || Object.keys(data).length === 0) {
      return { error: "No data provided to update." };
    }

    const user = await prisma.user.update({
      where: { clerkUserId },
      data,
    });

    revalidatePath(Routes.ROOT);
    revalidatePath(Routes.OWNER);

    return { user };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 500, success: false, message: error.message };
    }
    return { status: 500, success: false, message: "Unknown error occurred" };
  }
}

export async function deleteUser(clerkUserId: string) {
  try {
    //Delete from Clerk
    try {
      await clerkClient.users.deleteUser(clerkUserId);
    } catch (clerkError) {
      if (clerkError instanceof Error) {
        console.warn("Clerk deletion skipped or failed:", clerkError.message);
      } else {
        console.warn("Clerk deletion failed with unknown error:", clerkError);
      }
    }

    // Delete from DB
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!existingUser) {
      return {
        status: 200,
        message: "User already deleted from DB.",
      };
    }

    await prisma.user.delete({
      where: { clerkUserId },
    });

    revalidatePath(Routes.LISTROOMS);
    revalidatePath(Routes.OWNER);
    revalidatePath(Pages.MYBOOKINGS);
    revalidatePath(Routes.ROOT);

    return {
      status: 200,
      message: "User deleted successfully",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 500, success: false, message: error.message };
    }
    return { status: 500, success: false, message: "Unknown error occurred" };
  }
}

export async function storeRecentSearchedCity(recentSearchedCity: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { recentSearchedCities: true },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const alreadyExists =
      user.recentSearchedCities.includes(recentSearchedCity);

    let updatedCities = user.recentSearchedCities.filter(
      (city) => city !== recentSearchedCity,
    );

    updatedCities = [recentSearchedCity, ...updatedCities].slice(0, 3);

    await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        recentSearchedCities: updatedCities,
      },
    });

    revalidatePath(Routes.ROOT);

    return {
      success: true,
      alreadyExists,
      message: alreadyExists ? "City already exists" : "City added",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 500, success: false, message: error.message };
    }
    return { status: 500, success: false, message: "Unknown error occurred" };
  }
}
