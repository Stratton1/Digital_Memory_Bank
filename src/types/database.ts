export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          memory_date: string | null;
          location: string | null;
          is_private: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          memory_date?: string | null;
          location?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          memory_date?: string | null;
          location?: string | null;
          is_private?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      memory_media: {
        Row: {
          id: string;
          memory_id: string;
          storage_path: string;
          file_type: string;
          mime_type: string;
          file_size: number;
          caption: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          memory_id: string;
          storage_path: string;
          file_type: string;
          mime_type: string;
          file_size: number;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          memory_id?: string;
          storage_path?: string;
          file_type?: string;
          mime_type?: string;
          file_size?: number;
          caption?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          usage_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          usage_count?: number;
          created_at?: string;
        };
      };
      memory_tags: {
        Row: {
          memory_id: string;
          tag_id: string;
        };
        Insert: {
          memory_id: string;
          tag_id: string;
        };
        Update: {
          memory_id?: string;
          tag_id?: string;
        };
      };
      family_connections: {
        Row: {
          id: string;
          requester_id: string;
          recipient_id: string;
          relationship_label: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          recipient_id: string;
          relationship_label: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          requester_id?: string;
          recipient_id?: string;
          relationship_label?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      shared_memories: {
        Row: {
          id: string;
          memory_id: string;
          owner_id: string;
          shared_with_id: string;
          permission: string;
          created_at: string;
          revoked_at: string | null;
        };
        Insert: {
          id?: string;
          memory_id: string;
          owner_id: string;
          shared_with_id: string;
          permission?: string;
          created_at?: string;
          revoked_at?: string | null;
        };
        Update: {
          id?: string;
          memory_id?: string;
          owner_id?: string;
          shared_with_id?: string;
          permission?: string;
          created_at?: string;
          revoked_at?: string | null;
        };
      };
      daily_prompts: {
        Row: {
          id: string;
          question_text: string;
          category: string;
          depth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_text: string;
          category: string;
          depth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_text?: string;
          category?: string;
          depth?: string;
          created_at?: string;
        };
      };
      prompt_responses: {
        Row: {
          id: string;
          user_id: string;
          prompt_id: string;
          response_text: string;
          converted_to_memory_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          prompt_id: string;
          response_text: string;
          converted_to_memory_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          prompt_id?: string;
          response_text?: string;
          converted_to_memory_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
