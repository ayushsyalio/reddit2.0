import * as React from "react";
import { FlameIcon, GalleryVerticalEnd, HomeIcon, Minus, Plus, TrendingUpIcon } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { getSubreadits } from "@/sanity/lib/subreadits/getSubreadits";
import CreateCommunityButton from "./header/CreateCommunityButton";

type SidebarData = {
  navMain: {
    title: string;
    url: string;
    items: {
      title: string;
      url: string;
      isActive: boolean;
    }[];
  }[];
};

const sidebarData: SidebarData = {
  navMain: [
    {
      title: "Communities",
      url: "#",
      items: [
        {
          title: "Installation",
          url: "#",
          isActive: false,
        },
        {
          title: "Project Structure",
          url: "#",
          isActive: false,
        },
      ],
    },
  ],
};

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const subreadits = await getSubreadits();
  
  const sidebarData: SidebarData = {
  navMain: [
    {
      title: "Communities",
      url: "#",
      items: subreadits?.map((subreadit)=>({
        title:subreadit.title || "unknown",
        url:`/community/${subreadit.slug}`,
        isActive:false,
      })) || [],
    },
  ],
};


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <Image
                  src="/images/readittextNlogo.png"
                  alt="Logo"
                  width={100}
                  height={100}
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <CreateCommunityButton />
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5">
                <Link href="/">
                <HomeIcon className="w-4 h-4 mr-2"/>
                Home
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5">
                <Link href="/popular">
                <TrendingUpIcon className="w-4 h-4 mr-2"/>
                Popular
                </Link>
              </SidebarMenuButton>

              <SidebarMenuButton asChild className="p-5">
                <Link href="/hot">
                <FlameIcon className="w-4 h-4 mr-2"/>
                Hot/Controversial
                </Link>
              </SidebarMenuButton>


            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarData.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}{" "}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <Link href={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
