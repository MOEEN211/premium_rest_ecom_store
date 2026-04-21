import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useSupabaseBeds() {
  const [beds, setBeds] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [{ data: bedsData }, { data: optionsData }] = await Promise.all([
        supabase.from('beds').select('*'),
        supabase.from('bed_options').select('*')
      ]);

      if (bedsData) {
        const formattedBeds = bedsData.map(bed => {
          let urls = [];
          try {
            urls = JSON.parse(bed.image_url);
            if (!Array.isArray(urls)) urls = [urls];
          } catch(e) {
            urls = [bed.image_url];
          }
          return {
            ...bed,
            category: bed.category || 'bed',
            img: urls[0],
            gallery: urls,
            isSupabase: true
          };
        });
        setBeds(formattedBeds.reverse());
      }
      
      if (optionsData) {
        setOptions(optionsData);
      }
      
      setLoading(false);
    }
    fetchData();
  }, []);

  return { beds, options, loading };
}
