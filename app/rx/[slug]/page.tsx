
import { useLinks } from '@/lib/LinkContext';
import { supabase } from '@/lib/supabase-client';
import { redirect } from 'next/navigation';
// import React, { useEffect } from 'react'

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // const { getLinkBySlug } = useLinks();

  const { data, error } = await supabase.from('links').select('*').eq('slug', slug).single();

  console.log(data, error);

  // useEffect(() => {
  // const fetchData = async () => {
  //   const link = await getLinkBySlug(slug);
  //   console.log(link);
  // };
  // fetchData();
  // }, [slug]);

  // redirect user to the destination URL
  if (data?.url) {
    redirect(data.url);
  }

  return <div>Link not found</div>;
}

export default page