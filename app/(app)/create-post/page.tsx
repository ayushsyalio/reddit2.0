import CreateCommunityButton from "@/components/header/CreateCommunityButton";
import CreatePostForm from "@/components/post/CreatePostForm";
import SubreaditComboBox from "@/components/subreadit/SubreaditComboBox";
import { getSubreadits } from "@/sanity/lib/subreadits/getSubreadits";

export default async function createPostPage({
    searchParams,
}:{
    searchParams:Promise<{subreadit:string}>
}){
    const {subreadit} = await searchParams;

    //get all subreadits
    const subreadits = await getSubreadits();

    if(subreadit){
        return (
            <>
            {/* Banner */}
            <section className="bg-white border-b">
                <div className="mx-auto max-w-7xl px-4 py-6">
                    <div className="flex items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Create Post</h1>
                            <p className="text-sm text-gray-600">Create a post in the {" "}</p>
                            <span className="font-bold">{subreadit}</span>community.
                        </div>
                    </div>
                </div>
            </section>
            {/* content */}
            {/* Add post creation form */}
            <section className="my-8">
                <CreatePostForm/>

            </section>
            </>
        )
    }
    return (
        <>
        {/* Banner */}
        <section className="bg-white border-b">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="flex items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Create Post</h1>
                        <p className="text-sm text-gray-600">Select a community for your post</p>
                    </div>
                </div>
            </div>
        </section>

        {/* content */}
        <section className="my-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex flex-col gap-4">
                    <div className="max-w-3xl">
                        <label className="block text-sm font-medium mb-2">Select a community to post in</label>
                        <SubreaditComboBox
                        subreadits={subreadits}
                        defaultValue={subreadit}
                        />
                        <hr className="my-4"/>
                        <p className="mt-4 text-sm text-gray-600">
                            If you do not see your community, you can create it here.
                        </p>
                        <div className="mt-2">
                            <CreateCommunityButton/>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        </>
    )
}