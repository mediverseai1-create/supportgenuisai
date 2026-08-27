export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string | null
          company: string | null
          industry: string | null
          country: string | null
          team_size: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          company?: string | null
          industry?: string | null
          country?: string | null
          team_size?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          role?: string | null
          company?: string | null
          industry?: string | null
          country?: string | null
          team_size?: string | null
          onboarding_completed?: boolean
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          website: string | null
          industry: string | null
          country: string | null
          team_size: string | null
          logo_url: string | null
          plan: 'free' | 'starter' | 'pro'
          plan_started_at: string | null
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          website?: string | null
          industry?: string | null
          country?: string | null
          team_size?: string | null
          logo_url?: string | null
          plan?: 'free' | 'starter' | 'pro'
          plan_started_at?: string | null
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          website?: string | null
          industry?: string | null
          country?: string | null
          team_size?: string | null
          logo_url?: string | null
          plan?: 'free' | 'starter' | 'pro'
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by: string | null
          joined_at: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'member' | 'viewer'
          invited_by?: string | null
          joined_at?: string
          created_at?: string
        }
        Update: {
          role?: 'owner' | 'admin' | 'member' | 'viewer'
        }
      }
      invitations: {
        Row: {
          id: string
          organization_id: string
          email: string
          role: 'admin' | 'member' | 'viewer'
          token: string
          invited_by: string
          accepted_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          email: string
          role?: 'admin' | 'member' | 'viewer'
          token: string
          invited_by: string
          expires_at: string
          created_at?: string
        }
        Update: {
          accepted_at?: string | null
        }
      }
      agents: {
        Row: {
          id: string
          organization_id: string
          name: string
          slug: string
          description: string | null
          persona: string | null
          greeting_message: string | null
          escalation_rules: Json | null
          voice_enabled: boolean
          widget_enabled: boolean
          is_published: boolean
          primary_color: string | null
          status: 'draft' | 'training' | 'active' | 'paused'
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          slug: string
          description?: string | null
          persona?: string | null
          greeting_message?: string | null
          escalation_rules?: Json | null
          voice_enabled?: boolean
          widget_enabled?: boolean
          is_published?: boolean
          primary_color?: string | null
          status?: 'draft' | 'training' | 'active' | 'paused'
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          persona?: string | null
          greeting_message?: string | null
          escalation_rules?: Json | null
          voice_enabled?: boolean
          widget_enabled?: boolean
          is_published?: boolean
          primary_color?: string | null
          status?: 'draft' | 'training' | 'active' | 'paused'
          updated_at?: string
        }
      }
      knowledge_sources: {
        Row: {
          id: string
          agent_id: string
          organization_id: string
          type: 'url' | 'pdf' | 'text' | 'faq' | 'document'
          title: string
          url: string | null
          file_path: string | null
          content: string | null
          status: 'pending' | 'processing' | 'indexed' | 'error'
          error_message: string | null
          item_count: number
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          organization_id: string
          type: 'url' | 'pdf' | 'text' | 'faq' | 'document'
          title: string
          url?: string | null
          file_path?: string | null
          content?: string | null
          status?: 'pending' | 'processing' | 'indexed' | 'error'
          error_message?: string | null
          item_count?: number
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          url?: string | null
          content?: string | null
          status?: 'pending' | 'processing' | 'indexed' | 'error'
          error_message?: string | null
          item_count?: number
          updated_at?: string
        }
      }
      knowledge_items: {
        Row: {
          id: string
          source_id: string
          agent_id: string
          organization_id: string
          question: string | null
          answer: string | null
          content: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source_id: string
          agent_id: string
          organization_id: string
          question?: string | null
          answer?: string | null
          content: string
          category?: string | null
          created_at?: string
        }
        Update: {
          question?: string | null
          answer?: string | null
          content?: string
          category?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          agent_id: string
          organization_id: string
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
          channel: 'voice' | 'widget' | 'api'
          status: 'active' | 'resolved' | 'escalated' | 'abandoned'
          sentiment: 'positive' | 'neutral' | 'negative' | null
          intent: string | null
          summary: string | null
          resolution: string | null
          escalated_to: string | null
          escalated_at: string | null
          duration_seconds: number | null
          message_count: number
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          organization_id: string
          customer_name?: string | null
          customer_email?: string | null
          customer_phone?: string | null
          channel?: 'voice' | 'widget' | 'api'
          status?: 'active' | 'resolved' | 'escalated' | 'abandoned'
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          intent?: string | null
          summary?: string | null
          resolution?: string | null
          escalated_to?: string | null
          escalated_at?: string | null
          duration_seconds?: number | null
          message_count?: number
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          customer_name?: string | null
          customer_email?: string | null
          status?: 'active' | 'resolved' | 'escalated' | 'abandoned'
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          intent?: string | null
          summary?: string | null
          resolution?: string | null
          escalated_to?: string | null
          escalated_at?: string | null
          duration_seconds?: number | null
          message_count?: number
          ended_at?: string | null
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          organization_id: string
          role: 'customer' | 'agent' | 'system'
          content: string
          audio_url: string | null
          confidence: number | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          organization_id: string
          role: 'customer' | 'agent' | 'system'
          content: string
          audio_url?: string | null
          confidence?: number | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          content?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          organization_id: string
          user_id: string | null
          action: string
          entity_type: string | null
          entity_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id?: string | null
          action: string
          entity_type?: string | null
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: Record<string, never>
      }
      notifications: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          type: string
          title: string
          message: string
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          read?: boolean
        }
      }
    }
  }
}
