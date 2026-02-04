'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetFunnelQuery } from '@/store/api/funnelsApi';
import { useGetNodesQuery, useCreateNodeMutation, useUpdateNodeMutation, useDeleteNodeMutation } from '@/store/api/nodesApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTelegram } from '@/hooks/use-telegram';
import type { Node } from '@/types';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
  MousePointer,
  Clock,
  CreditCard,
  GitBranch,
  Loader2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const NODE_CONFIG = {
  MESSAGE: { icon: MessageSquare, label: 'Сообщение', color: 'text-blue-500' },
  BUTTON: { icon: MousePointer, label: 'Кнопки', color: 'text-green-500' },
  DELAY: { icon: Clock, label: 'Задержка', color: 'text-yellow-500' },
  PAYMENT: { icon: CreditCard, label: 'Оплата', color: 'text-purple-500' },
  CONDITION: { icon: GitBranch, label: 'Условие', color: 'text-orange-500' },
} as const;

type NodeType = keyof typeof NODE_CONFIG;

const DEFAULT_CONTENT: Record<NodeType, Record<string, unknown>> = {
  MESSAGE: { text: '' },
  BUTTON: { text: '', buttons: [] },
  DELAY: { seconds: 5 },
  PAYMENT: { productName: '', price: 0 },
  CONDITION: { variable: '', operator: '==', value: '' },
};

export default function EditFunnelPage() {
  const params = useParams();
  const router = useRouter();
  const { haptic } = useTelegram();
  const funnelId = params.id as string;

  // State
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteNodeId, setDeleteNodeId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, unknown>>({});

  // Queries & Mutations
  const { data: funnel, isLoading: funnelLoading } = useGetFunnelQuery(funnelId);
  const { data: nodes, isLoading: nodesLoading } = useGetNodesQuery(funnelId);
  const [createNode, { isLoading: isCreating }] = useCreateNodeMutation();
  const [updateNode, { isLoading: isUpdating }] = useUpdateNodeMutation();
  const [deleteNode, { isLoading: isDeleting }] = useDeleteNodeMutation();

  const isLoading = funnelLoading || nodesLoading;

  // Handlers
  const handleAddNode = async (type: NodeType) => {
    haptic('light');
    try {
      await createNode({
        funnelId,
        data: {
          type,
          name: NODE_CONFIG[type].label,
          content: DEFAULT_CONTENT[type],
        },
      }).unwrap();
      haptic('success');
    } catch {
      haptic('error');
    }
  };

  const handleEditNode = (node: Node) => {
    haptic('light');
    setEditingNode(node);
    setEditedContent(node.content || {});
    setIsSheetOpen(true);
  };

  const handleSaveNode = async () => {
    if (!editingNode) return;
    haptic('light');
    try {
      await updateNode({
        id: editingNode.id,
        data: {
          content: editedContent,
        },
      }).unwrap();
      haptic('success');
      setIsSheetOpen(false);
      setEditingNode(null);
    } catch {
      haptic('error');
    }
  };

  const handleDeleteNode = async () => {
    if (!deleteNodeId) return;
    haptic('light');
    try {
      await deleteNode({ id: deleteNodeId, funnelId }).unwrap();
      haptic('success');
      setDeleteNodeId(null);
    } catch {
      haptic('error');
    }
  };

  const handleMoveNode = async (node: Node, direction: 'up' | 'down') => {
    if (!nodes) return;
    haptic('light');

    const currentIndex = nodes.findIndex(n => n.id === node.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= nodes.length) return;

    // Меняем позиции (упрощённая логика — в реальности нужен endpoint для reorder)
    // Пока просто обновляем position
    try {
      await updateNode({
        id: node.id,
        data: { position: { x: 0, y: newIndex * 100 } },
      }).unwrap();
      haptic('success');
    } catch {
      haptic('error');
    }
  };

  // Render content editor based on node type
  const renderContentEditor = () => {
    if (!editingNode) return null;

    switch (editingNode.type) {
      case 'MESSAGE':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Текст сообщения</Label>
              <textarea
                id="text"
                className="w-full mt-1.5 p-3 border rounded-lg min-h-[120px] resize-none"
                placeholder="Введите текст сообщения..."
                value={(editedContent.text as string) || ''}
                onChange={e => setEditedContent({ ...editedContent, text: e.target.value })}
              />
            </div>
          </div>
        );

      case 'BUTTON':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="buttonText">Текст перед кнопками</Label>
              <textarea
                id="buttonText"
                className="w-full mt-1.5 p-3 border rounded-lg min-h-[80px] resize-none"
                placeholder="Выберите действие..."
                value={(editedContent.text as string) || ''}
                onChange={e => setEditedContent({ ...editedContent, text: e.target.value })}
              />
            </div>
            <div>
              <Label>Кнопки</Label>
              <div className="space-y-2 mt-1.5">
                {((editedContent.buttons as Array<{ text: string }>) || []).map((btn, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={btn.text}
                      onChange={e => {
                        const newButtons = [...((editedContent.buttons as Array<{ text: string }>) || [])];
                        newButtons[i] = { ...newButtons[i], text: e.target.value };
                        setEditedContent({ ...editedContent, buttons: newButtons });
                      }}
                      placeholder="Текст кнопки"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newButtons = ((editedContent.buttons as Array<{ text: string }>) || []).filter(
                          (_, idx) => idx !== i
                        );
                        setEditedContent({ ...editedContent, buttons: newButtons });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newButtons = [...((editedContent.buttons as Array<{ text: string }>) || []), { text: '' }];
                    setEditedContent({ ...editedContent, buttons: newButtons });
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Добавить кнопку
                </Button>
              </div>
            </div>
          </div>
        );

      case 'DELAY':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="seconds">Задержка (секунды)</Label>
              <Input
                id="seconds"
                type="number"
                min={1}
                max={86400}
                value={(editedContent.seconds as number) || 5}
                onChange={e => setEditedContent({ ...editedContent, seconds: parseInt(e.target.value) || 5 })}
              />
              <p className="text-xs text-muted-foreground mt-1">От 1 до 86400 секунд (24 часа)</p>
            </div>
          </div>
        );

      case 'PAYMENT':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">Название товара</Label>
              <Input
                id="productName"
                value={(editedContent.productName as string) || ''}
                onChange={e => setEditedContent({ ...editedContent, productName: e.target.value })}
                placeholder="Онлайн-курс по маркетингу"
              />
            </div>
            <div>
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={(editedContent.price as number) || 0}
                onChange={e => setEditedContent({ ...editedContent, price: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        );

      case 'CONDITION':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Условные переходы будут доступны в следующей версии
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="h-6 w-48" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Воронка не найдена</p>
        <Button asChild className="mt-4">
          <Link href="/funnels">К списку</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/funnels/${funnelId}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="font-bold truncate">Редактор</h1>
          <p className="text-sm text-muted-foreground truncate">{funnel.name}</p>
        </div>
      </div>

      {/* Add Node Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full" disabled={isCreating}>
            {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Добавить шаг
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          {Object.entries(NODE_CONFIG).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <DropdownMenuItem key={type} onClick={() => handleAddNode(type as NodeType)}>
                <Icon className={`w-4 h-4 mr-2 ${config.color}`} />
                {config.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Nodes List */}
      {nodes && nodes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Нет шагов. Добавьте первый шаг выше.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {nodes?.map((node, index) => {
            const config = NODE_CONFIG[node.type as NodeType];
            const Icon = config?.icon || MessageSquare;
            const content = node.content as Record<string, unknown>;

            return (
              <Card key={node.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    {/* Drag Handle / Index */}
                    <div className="flex flex-col items-center justify-center w-10 bg-gray-50 self-stretch">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === 0}
                        onClick={() => handleMoveNode(node, 'up')}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">{index + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === (nodes?.length || 0) - 1}
                        onClick={() => handleMoveNode(node, 'down')}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3 min-w-0" onClick={() => handleEditNode(node)}>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${config?.color}`} />
                        <span className="font-medium text-sm">{node.name}</span>
                      </div>
                      {typeof content?.text === 'string' && content.text && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {content.text}
                        </p>
                      )}
                      {typeof content?.productName === 'string' && content.productName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {content.productName}: {content.price as number}₽
                        </p>
                      )}
                      {typeof content?.seconds === 'number' && content.seconds > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Задержка: {content.seconds} сек
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center pr-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditNode(node)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500"
                        onClick={() => setDeleteNodeId(node.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {editingNode && NODE_CONFIG[editingNode.type as NodeType] && (
                <>
                  {(() => {
                    const Icon = NODE_CONFIG[editingNode.type as NodeType].icon;
                    return <Icon className={`w-5 h-5 ${NODE_CONFIG[editingNode.type as NodeType].color}`} />;
                  })()}
                  {NODE_CONFIG[editingNode.type as NodeType].label}
                </>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="py-4 overflow-y-auto">{renderContentEditor()}</div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSaveNode} disabled={isUpdating}>
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Сохранить'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteNodeId} onOpenChange={() => setDeleteNodeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить шаг?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNode} className="bg-red-600" disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
