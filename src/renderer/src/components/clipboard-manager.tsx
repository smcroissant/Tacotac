import type { ClipboardItem } from "@renderer/env";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TextItem } from "./text-item";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export function ClipboardManager() {
	const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>([]);

	useEffect(() => {
		// Try to initialize with API
		const initializeWithApi = async () => {
			try {
				const history = await window.api.getClipboardHistory();
				setClipboardItems(history);

				// Subscribe to clipboard updates
				window.api.onClipboardUpdated((items) => {
					setClipboardItems(items);
				});
			} catch (error) {
				console.error("Failed to initialize clipboard history:", error);
			}
		};

		initializeWithApi();

		// Cleanup subscription on unmount
		return () => {
			if (window.api) {
				window.api.removeClipboardListener();
			}
		};
	}, []);

	const [searchQuery, setSearchQuery] = useState("");

	const filteredItems = clipboardItems.filter((item) =>
		item.text.toLowerCase().includes(searchQuery.toLowerCase()),
	);

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
			className="h-screen bg-background"
			style={{ "-webkit-app-region": "drag" }}
		>
			<Card className="synthwave-card h-full px-0 py-2 gap-0 ">
				<div className="pb-0 px-0 space-y-2 flex flex-col h-full">
					<div className="relative px-2">
						<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent" />
						<Input
							placeholder="SEARCH CLIPBOARD..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 font-mono bg-input border-glow text-foreground placeholder:text-muted-foreground tracking-wide"
							style={{ "-webkit-app-region": "no-drag" }}
							autoFocus
						/>
					</div>
					<ScrollArea className="flex-1 overflow-auto px-2">
						<div className="w-full">
							<div
								className="space-y-2"
								style={{ "-webkit-app-region": "no-drag" }}
							>
								{filteredItems.length === 0 ? (
									<div className="text-center py-8">
										<div className="text-muted-foreground font-mono text-sm tracking-wide">
											◢ NO DATA FOUND ◣
										</div>
									</div>
								) : (
									filteredItems.map((item) => (
										<TextItem key={item.id} item={item} onDelete={deleteItem} />
									))
								)}
							</div>
						</div>
					</ScrollArea>
				</div>
			</Card>
		</div>
	);
}
