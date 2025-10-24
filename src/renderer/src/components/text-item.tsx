import { Trash2 } from "lucide-react";
import type { ClipboardItem } from "@renderer/env";
import { toast } from "sonner";

export const TextItem = ({
	item,
	onDelete,
}: {
	item: ClipboardItem;
	onDelete: (id: number) => void;
}) => {
	const copyToClipboard = async (content: string) => {
		try {
			await navigator.clipboard.writeText(content);

			toast("Item copied to clipboard.");
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const deleteItem = async (id: number) => {
		try {
			window.api.deleteClipboardItem(id);
			toast("Item deleted.");
		} catch (error) {
			console.error("Failed to delete item:", error);
			toast("Failed to delete item.");
		}
	};

	return (
		<div
			key={item.id}
			className="group bg-secondary/80 border border-accent/30 rounded px-2 py-1 hover:border-accent hover:glow-cyan transition-all duration-300"
			title={item.text}
			style={{ "-webkit-app-region": "no-drag" }}
		>
			<div className="flex justify-between  gap-4">
				<div className="flex-1 min-w-0">
					{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
					{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className="text-sm font-mono text-foreground break-all leading-relaxed line-clamp-2"
						onClick={() => copyToClipboard(item.text)}
					>
						{item.text}
					</div>
				</div>

				<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity py-2">
					{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
					{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						onClick={() => deleteItem(item?.id || 0)}
						className="text-primary border-primary hover:text-background hover:glow-magenta font-mono"
					>
						<Trash2 className="w-4 h-4" />
					</div>
				</div>
			</div>
		</div>
	);
};
