export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          bio: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          socials: Json | null;
          stacks: Json | null;
          github_username: string | null;
          skills: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string | null;
          slug: string;
          title: string;
          subtitle: string | null;
          content: string | null;
          hero_image_url: string | null;
          gallery: Json | null;
          tags: string[] | null;
          external_link: string | null;
          rating: number | null;
          performance: number | null;
          difficulty: number | null;
          status: "draft" | "published" | null;
          published_at: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string | null;
          content: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
      };
      stacks: {
        Row: {
          id: string;
          name: string;
          icon: string | null;
          color: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string | null;
          color?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string | null;
          color?: string | null;
          created_at?: string | null;
        };
      };
      post_stacks: {
        Row: {
          post_id: string;
          stack_id: string;
        };
        Insert: {
          post_id: string;
          stack_id: string;
        };
        Update: {
          post_id?: string;
          stack_id?: string;
        };
      };
      media: {
        Row: {
          id: string;
          filename: string;
          path: string;
          url: string;
          type: string | null;
          size: number | null;
          width: number | null;
          height: number | null;
          user_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          filename: string;
          path: string;
          url: string;
          type?: string | null;
          size?: number | null;
          width?: number | null;
          height?: number | null;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          filename?: string;
          path?: string;
          url?: string;
          type?: string | null;
          size?: number | null;
          width?: number | null;
          height?: number | null;
          user_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
};
