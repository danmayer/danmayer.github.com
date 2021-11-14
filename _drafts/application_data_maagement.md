I have been developing application code and working with teams of developers for over a decade. Application developers often don't treat data with the respect it deserves and it can come back to bite you in various forms.

* Data Refactoring
  * massive schema changes required 
* Data Integrity Failures
  * data duplication sync failures (same column multiple tables / DBs)
* Deprecated Tables and Columns galore

---

Folks say make code easy to change or delete, but we need to be thinking that same way about our data, every object, field, etc we need a way to see when it is in use and who is using it.

---

ways to improve

* [Data Change Management Process](https://www.mayerdan.com/programming/2016/11/21/managing-rails-migrations)
   * Information Architecture Redesign Flow 

* data unused tables
* unused columns *2
* move DB stuff to a gem (table and columns)  
* gemify the information architecture change approach
* [IA Change Process Presentation](https://www.mayerdan.com/ia_change/IA_Change_Process.htm)