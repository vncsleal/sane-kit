"use client";

import { useState, useEffect } from "react";
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
 * Main router component for Compare Features section
 * This component fetches the feature details from Sanity and passes them to the appropriate variant
 */
export default function CompareFeaturesRouter(props: CompareFeaturesSection) {
  const [features, setFeatures] = useState<CompareFeatureWithTitle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the feature titles from Sanity - we receive references to features in the props
  useEffect(() => {
    // Initialize with empty array if no features are provided
    if (!props.features || props.features.length === 0) {
      setFeatures([]);
      setLoading(false);
      return;
    }
    
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        
        // Check if we have proper references
        if (!props.features?.[0]?._ref) {
          throw new Error("Feature references are missing _ref property");
        }
        
        // Get all feature IDs 
        const featureIds = props.features?.map((feature) => feature._ref) || [];
        
        // Fetch the feature details from Sanity
        const query = `*[_type == "compareFeature" && _id in $ids]{
          _id,
          title
        }`;
        
        const results = await client.fetch<Array<{ _id: string; title: string }>>(query, { ids: featureIds });
        
        // Check if we got results back
        if (results.length === 0) {
          console.error("No features found with the provided IDs:", featureIds);
        }
        
        // Map the results to include the _key from the original features
        // and ensure they are in the same order as the original feature references
        const featuresWithKeys = props.features?.map(originalFeature => {
          const featureDetail = results.find(result => result._id === originalFeature._ref);
          
          if (!featureDetail) {
            console.warn(`Feature not found for ref: ${originalFeature._ref}, key: ${originalFeature._key}`);
          }
          
          return {
            _id: originalFeature._ref,
            _key: originalFeature._key || `feature-${originalFeature._ref}`, // Ensure we have a key
            title: featureDetail?.title || `Feature not found (${originalFeature._ref?.slice(0,8)})`
          };
        }) || [];
        
        setFeatures(featuresWithKeys);
      } catch (error) {
        console.error("Error fetching features:", error);
        
        // Still provide the component with at least the feature IDs in case of error
        const fallbackFeatures = props.features?.map((f, index) => ({
          _id: f._ref || `unknown-${index}`,
          _key: f._key || `fallback-${index}`,
          title: `Error loading feature ${index + 1}`
        })) || [];
        setFeatures(fallbackFeatures);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatures();
  }, [props.features]);

  // Currently there's only one variant, but this structure allows for adding more in the future
  return <Default {...props} features={features} isLoading={loading} />;
}

// Re-export the main component types for convenience
export type { CompareFeaturesSection };
