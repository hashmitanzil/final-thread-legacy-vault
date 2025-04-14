
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Trash2, Plus, Edit, Save, X } from 'lucide-react';

interface Wish {
  id: string;
  content: string;
  created_at: string;
}

const WishesList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newWish, setNewWish] = useState('');
  const [editingWish, setEditingWish] = useState<{ id: string; content: string } | null>(null);

  // Fetch wishes
  const { data: wishes, isLoading } = useQuery({
    queryKey: ['wishes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Wish[];
    },
    enabled: !!user,
  });

  // Add wish mutation
  const addWishMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('wishes')
        .insert({
          user_id: user.id,
          content
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes'] });
      setNewWish('');
      toast({
        title: 'Wish added',
        description: 'Your wish has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add wish',
        variant: 'destructive',
      });
    },
  });

  // Update wish mutation
  const updateWishMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { data, error } = await supabase
        .from('wishes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes'] });
      setEditingWish(null);
      toast({
        title: 'Wish updated',
        description: 'Your wish has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update wish',
        variant: 'destructive',
      });
    },
  });

  // Delete wish mutation
  const deleteWishMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('wishes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishes'] });
      toast({
        title: 'Wish deleted',
        description: 'Your wish has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete wish',
        variant: 'destructive',
      });
    },
  });

  const handleAddWish = () => {
    if (!newWish.trim()) return;
    addWishMutation.mutate(newWish);
  };

  const handleUpdateWish = () => {
    if (!editingWish || !editingWish.content.trim()) return;
    updateWishMutation.mutate({ 
      id: editingWish.id, 
      content: editingWish.content 
    });
  };

  const handleDeleteWish = (id: string) => {
    deleteWishMutation.mutate(id);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading wishes...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Add a new wish..."
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddWish();
          }}
        />
        <Button 
          onClick={handleAddWish}
          disabled={!newWish.trim() || addWishMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {wishes && wishes.length > 0 ? (
          wishes.map((wish) => (
            <Card key={wish.id} className="relative">
              <CardContent className="p-4">
                {editingWish && editingWish.id === wish.id ? (
                  <div className="flex space-x-2">
                    <Input
                      value={editingWish.content}
                      onChange={(e) => setEditingWish({ ...editingWish, content: e.target.value })}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleUpdateWish}
                      disabled={updateWishMutation.isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingWish(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-sm">{wish.content}</p>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingWish({ id: wish.id, content: wish.content })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteWish(wish.id)}
                        disabled={deleteWishMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-6">
            No wishes added yet. Add your first wish above.
          </div>
        )}
      </div>
    </div>
  );
};

export default WishesList;
