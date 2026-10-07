import {
	S3Client,
} from "@aws-sdk/client-s3";




export const s3 = new S3Client({
	region: "auto", // Required by AWS SDK, not used by R2
	// Provide your R2 endpoint: https://<ACCOUNT_ID>.r2.cloudflarestorage.com
	endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
	credentials: {
		// Provide your R2 Access Key ID and Secret Access Key
		accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
	},
});

export const R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET || "blankdev";

export function getR2PublicUrl(key: string): string {
	const publicUrl =
		process.env.R2_PUBLIC_URL || process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN;
	if (publicUrl) {
		const domain = publicUrl.replace(/\/$/, "");
		const cleanKey = key.replace(/^\/+/, "");
		return `${domain}/${cleanKey}`;
	}
	// Fallback to endpoint/bucket/key structure
	const endpoint = (process.env.CLOUDFLARE_R2_ENDPOINT || "").replace(/\/$/, "");
	const cleanKey = key.replace(/^\/+/, "");
	return `${endpoint}/${R2_BUCKET_NAME}/${cleanKey}`;
}


