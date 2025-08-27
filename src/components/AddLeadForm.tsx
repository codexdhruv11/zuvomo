import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService } from "@/services/googleSheets";

interface AddLeadFormProps {
  children?: React.ReactNode;
  editLead?: any;
  editIndex?: number;
  onClose?: () => void;
  onLeadUpdated?: () => void;
}

interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  leadType: string;
  leadStatus?: string;
  source: string;
  value: string;
  notes: string;
  assignedTo: string;
}

export function AddLeadForm({ children, editLead, editIndex, onClose, onLeadUpdated }: AddLeadFormProps) {
  const { toast } = useToast();
  const isEditing = !!editLead;
  
  const form = useForm<LeadFormData>({
    defaultValues: isEditing ? {
      firstName: editLead?.name?.split(' ')[0] || "",
      lastName: editLead?.name?.split(' ').slice(1).join(' ') || "",
      email: editLead?.email || "",
      phone: editLead?.phone || "",
      company: editLead?.company || "",
      position: editLead?.contactType || "",
      leadType: editLead?.contactType || "",
      leadStatus: editLead?.leadStatus || "",
      source: editLead?.source || "",
      value: editLead?.value?.toString() || "",
      notes: editLead?.notes || "",
      assignedTo: editLead?.assignedTo || ""
    } : {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      leadType: "",
      leadStatus: "",
      source: "",
      value: "",
      notes: "",
      assignedTo: ""
    }
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      // Prepare lead data for Google Sheets
      const leadData = {
        name: `${data.firstName} ${data.lastName}`,
        company: data.company,
        email: data.email,
        phone: data.phone,
        stage: isEditing ? editLead.stage : 'new',
        leadStatus: data.leadStatus || 'cold',
        projectStage: isEditing ? editLead.projectStage : 'Outreach',
        source: data.source,
        value: parseFloat(data.value) || 0,
        assignedTo: data.assignedTo,
        notes: data.notes,
        lastContact: isEditing ? editLead.lastContact : new Date().toISOString().split('T')[0],
        contactType: data.leadType
      };

      if (isEditing && editIndex !== undefined) {
        // Update existing lead
        await googleSheetsService.updateLead(editIndex, leadData);
        toast({
          title: "Lead Updated Successfully",
          description: `${data.firstName} ${data.lastName} from ${data.company} has been updated and synced to Google Sheets.`,
        });
      } else {
        // Add new lead
        await googleSheetsService.addLead(leadData);
        toast({
          title: "Lead Added Successfully",
          description: `${data.firstName} ${data.lastName} from ${data.company} has been added to your pipeline and synced to Google Sheets.`,
        });
      }

      form.reset();
      onClose?.();
      onLeadUpdated?.();
    } catch (error) {
      console.error(isEditing ? 'Failed to update lead:' : 'Failed to add lead:', error);
      toast({
        title: isEditing ? "Error Updating Lead" : "Error Adding Lead",
        description: `Failed to ${isEditing ? 'update' : 'add'} lead to Google Sheets. Please check your connection and try again.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/logo/Z logo .png" 
              alt="Zuvomo" 
              className="w-6 h-6 object-contain"
            />
            <DialogTitle>{isEditing ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
          </div>
          <DialogDescription>
            {isEditing 
              ? 'Update the details below to modify this lead in your pipeline.'
              : 'Fill in the details below to add a new lead to your pipeline.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="company"
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="CEO" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="leadType"
                rules={{ required: "Lead type is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CEO">CEO</SelectItem>
                        <SelectItem value="VC">VC</SelectItem>
                        <SelectItem value="Partner">Partner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leadStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Status (Optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cold">Cold</SelectItem>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="hot">Hot</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="source"
                rules={{ required: "Source is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="cold-call">Cold Call</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="assignedTo"
                rules={{ required: "Assignment is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Alice Johnson">Alice Johnson</SelectItem>
                        <SelectItem value="Bob Wilson">Bob Wilson</SelectItem>
                        <SelectItem value="Charlie Brown">Charlie Brown</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional notes about this lead..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-primary">
                {isEditing ? 'Update Lead' : 'Add Lead'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}