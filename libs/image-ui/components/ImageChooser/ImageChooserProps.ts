import { RefObject } from "preact";

export interface ImageChooserProps {
	image?: string;
	ref?: RefObject<any>;
	previewWidth: string;
	previewHeight: string;
}