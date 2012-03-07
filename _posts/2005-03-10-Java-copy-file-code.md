---
layout: post
title: "Java copy file code"
category:
tags: []
---
{% include JB/setup %}
just cause i didnt find code on this fast enough here is code to copy a file using java. It reads the file in while writting it out using buffered readers and writters:

 public static void copy(String from, String to) throws IOException{
   InputStream in = null;
    OutputStream out = null;
    try {
        in = new FileInputStream(from);
        out = new FileOutputStream(to);
        int length = 128*10240; // danger!
        byte[] bytes = new byte[length];
        int read=0;
        for(;;){
        read=in.read(bytes,0,length);
        if(read==-1){
            break;
        }
        out.write(bytes,0,read);
        }
        } finally {
            if (in != null) {
                in.close();
            }
            if (out != null) {
                out.close();
            }
        }
    }