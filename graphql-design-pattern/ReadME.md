# **Rules for Designing GraphQL Application**

1. Start with a High Level View of the Objects and Their Relationships
2. Never Expose Implementation Details
3. Design your API Around your Business Domain
4. It's Easier to Add Fields than to Remove Them
5. Group Closely-Related Fields Together into Sub-Objects
6. Always Check if a List Should be Paginated
7. Always use Object References Instead of ID Fields
8. Choose Field Names Based on What Makes Sense, Not the Implementation
9. Use Enums for Fields that can Only Take a Specific Set of Values
10. Your API should provide business Logic, Not just Data
11. Write Separate Mutations for Separate Logical Actions on a Resource
12. For Relationship Mutations consider operating on multiple Events
13. Prefix Mutations with the object for Alphabetical Grouping
14. Structure Mutation Inputs to reduce Duplication
15. Mutation should provide user/business level errors
