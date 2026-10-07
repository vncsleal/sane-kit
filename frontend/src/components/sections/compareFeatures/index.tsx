"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import type { CompareFeaturesSection } from "@/sanity/types";
import Default from "./default";

/**
 * Interface representing a compareFeature with title information
 */
export interface CompareFeatureWithTitle {
  _id: string;
  _key: string;
  title: string;
}

/**
 * Main router component for Compare Features section.
 * Resolves the referenced feature documents, then hands them to the variant.
 */
export default function CompareFeaturesRouter(props: CompareFeaturesSection) {
  const featureRefs = props.features ?? [];
  const [features, setFeatures] = useState<CompareFeatureWithTitle[]>([]);
  const [loading, setLoading] = useState(featureRefs.length > 0);

  useEffect(() => {
    const refs = props.features ?? [];
    if (refs.length === 0) return;

    let cancelled = false;

    const fetchFeatures = async () => {
      const ids = refs
        .map((feature) => feature._ref)
        .filter((ref): ref is string => Boolean(ref));

      const results = await client.fetch<Array<{ _id: string; title: string }>>(
        `*[_type == "compareFeature" && _id in $ids]{ _id, title }`,
        { ids },
      );

      if (cancelled) return;

      setFeatures(
        refs.map((originalFeature) => {
          const detail = results.find((result) => result._id === originalFeature._ref);
          return {
            _id: originalFeature._ref ?? "",
            _key: originalFeature._key || `feature-${originalFeature._ref}`,
            title: detail?.title || `Feature not found (${originalFeature._ref?.slice(0, 8)})`,
          };
        }),
      );
      setLoading(false);
    };

    void fetchFeatures();

    return () => {
      cancelled = true;
    };
  }, [props.features]);

  return <Default {...props} features={features} isLoading={loading} />;
}

// Re-export the main component types for convenience
export type { CompareFeaturesSection };
