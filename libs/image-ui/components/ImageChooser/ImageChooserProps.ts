import { RefObject } from "react";

export interface ImageChooserProps {
	image?: string;
	ref?: RefObject<any>;
	previewWidth: string;
	previewHeight: string;
}